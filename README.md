# DocumentAssessor

```
Develop a data-model (realisable in JSON), together with accompanying
RESTful API (any technology) and prototype interface (pure HTML/CSS/JS)
that demonstrates consumption of the API, for distributing document
assessment tasks online. Researchers will be able to create assessment tasks
that allow them to automatically assign a list of resources (e.g. links to PDF
documents or webpages) to a list of people and asks them to do an
assessment task (e.g. judge the document for its readability or summarize the
resource with a short text). You are responsible for implementing the following
two user stories:
```
```
(i) Researchers sign into their online account and create a new assessment
task (or edit one already created). An assessment task has a title, a
description, a link to instructions (e.g. a URL to a PDF file), a number that
defines how many assessments will be done per user, and an assessment form
(see user story (ii)). The researcher further creates a list of resources that
need to be assessed by users. For now, these resources are stored as links
(e.g. links to PDF documents or webpages). This list can also be imported from
a simple text file (since these may be 100s of links, simple ways of data entry
are appreciated). All changes are made persistent in a database.
```
```
(ii) Researchers assign users to the assessment task. The researcher creates
an assessment form (as a HTML form) that the user needs to complete for
each resource that (s)he assesses. The form contains questions (e.g. rating the
resource on a 5-point scale, or a free-text answer to a question about the
resource) and fields to answer these questions (e.g. a way to enter a number
or write a free-text answer). Assessment forms are stored persistently in the
database together with the assessment task.
```
```
Note that your group will have to liaise with the group that implements
Document Assessor (User View) with respect to the data model in order to
ensure compatibility and overall functionality
```
```
Ralf Bierig (Office EOLAS 134) offers meeting this student team (together with
the student team for Document Assessor (User View)) once per week for one
hour to assist with modelling, and be the expert user / software manager as
part of stand-up, debriefing, testing, etc.
```
